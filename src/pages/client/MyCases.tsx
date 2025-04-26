"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Briefcase, Clock, User, FileText, ChevronRight, AlertCircle, CheckCircle, XCircle, Filter, DollarSign } from "lucide-react"
import type { Case } from "../../types"
import { MyCase } from "@/services/caseService"
import PageLayout from "../../components/layouts/PageLayout"

interface MyCasesProps {
  userName: string
}

export default function MyCases({ userName }: MyCasesProps) {
  const [cases, setCases] = useState<Case[]>([])
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    async function fetchCases(){
      try{
        const mockCases = await MyCase()

        // consol.log(mockCases)

        setCases(mockCases)
      } catch (error){
        console.log(error)
      }
    }

    fetchCases();


    setTimeout(() => {
      const mockCases: Case[] = [
        // {
        //   id: 101,
        //   title: "Property Boundary Dispute",
        //   lawyer: "Abebe Kebede",
        //   status: "posted",
        //   lastUpdated: "2025-03-15",
        //   category: "Property Law",
        //   description:
        //     "Dispute regarding property boundary lines between client and neighbor. Client has provided deed and recent survey showing discrepancy with neighbor's fence placement.",
        // },
        // {
        //   id: 102,
        //   title: "Business Registration and Licensing",
        //   lawyer: "Yonas Tadesse",
        //   status: "assigned",
        //   lastUpdated: "2025-03-14",
        //   category: "Business Law",
        //   description:
        //     "Assistance with registering a new import/export business in Addis Ababa and obtaining necessary licenses.",
        // },
        // {
        //   id: 103,
        //   title: "Divorce Proceedings",
        //   lawyer: "Tigist Haile",
        //   status: "closed",
        //   lastUpdated: "2025-03-10",
        //   category: "Family Law",
        //   description: "Representation for divorce proceedings including child custody and asset division.",
        // },
        // {
        //   id: 104,
        //   title: "Employment Contract Review",
        //   lawyer: "Sara Mohammed",
        //   status: "closed",
        //   lastUpdated: "2025-02-28",
        //   category: "Labor Law",
        //   description: "Review of employment contracts for compliance with Ethiopian labor laws.",
        // },
        // {
        //   id: 105,
        //   title: "Trademark Registration",
        //   lawyer: "Meron Alemu",
        //   status: "posted",
        //   lastUpdated: "2025-02-15",
        //   category: "Intellectual Property",
        //   description: "Trademark registration and protection for a local clothing brand.",
        // },
      ]

      setCases(mockCases)
      setFilteredCases(mockCases)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filter cases based on selected status
    if (selectedStatus === "all") {
      setFilteredCases(cases)
    } else {
      const filtered = cases.filter((caseItem) => caseItem.status === selectedStatus)
      setFilteredCases(filtered)
    }
  }, [selectedStatus, cases])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
                return "bg-green-100 text-green-800"
      case "closed":
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <PageLayout userRole="client" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout userRole="client" userName={userName} unreadNotifications={3}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Cases</h1>
        {/* <p className="mt-2 text-blue-100">Manage and track your legal cases</p> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredCases.length} {selectedStatus === "all" ? "Total" : selectedStatus} Cases
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Cases</option>
                <option value="posted">Posted</option>
                <option value="assigned">Assigned</option>
                <option value="closed">Closed</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <Link
              to="/client/cases/post"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Post a New Case
            </Link>
          </div>
        </div>

        {filteredCases.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredCases.map((caseItem) => (
                <li key={caseItem._id} className="hover:bg-gray-50">
                  <Link to={`/client/cases/${caseItem._id}`} className="block">
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              {/* <h3 className="text-lg font-medium text-gray-900">{caseItem.title}</h3> */}
                              <span
                                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}
                              >
                                {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              <span className="flex items-center">
                                <User className="mr-1 h-4 w-4 text-gray-400" />
                                Lawyer: {caseItem.assigned_lawyer}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              <span className="flex items-center">
                                <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                                Winning Bid: {caseItem.winning_bid}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <Clock className="mr-1 h-4 w-4 text-gray-400" />
                              Last updated: {formatDate(caseItem.updatedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {caseItem.category}
                          </span>
                          <ChevronRight className="ml-4 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2"><strong>{caseItem.description}</strong></p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStatus === "all"
                ? "You don't have any cases yet."
                : `You don't have any ${selectedStatus} cases.`}
            </p>
            {selectedStatus !== "all" ? (
              <button
                onClick={() => setSelectedStatus("all")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
              >
                View All Cases
              </button>
            ) : null}
            <Link
              to="/client/cases/post"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Post a New Case
            </Link>
          </div>
        )}

        {/* Case Status Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Case Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Posted</p>
                <p className="text-sm text-gray-500">Case is posted and waiting for lawyers</p>
              </div>
            </div>
            <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Assigned</p>
                <p className="text-sm text-gray-500">Case is currently being worked on</p>
              </div>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Closed</p>
                <p className="text-sm text-gray-500">Case has been resolved or cancelled</p>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

